import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import express from 'express';
import { z } from 'zod';

// Create an MCP server
const server = new McpServer({
    name: 'sample-http-mcp-server',
    version: '1.0.0'
});

// Register an addition tool
server.registerTool(
    'add',
    {
        title: 'Addition Tool',
        description: 'Add two numbers together',
        inputSchema: { a: z.number(), b: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ a, b }) => {
        const output = { result: a + b };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Register a multiplication tool
server.registerTool(
    'multiply',
    {
        title: 'Multiplication Tool',
        description: 'Multiply two numbers together',
        inputSchema: { a: z.number(), b: z.number() },
        outputSchema: { result: z.number() }
    },
    async ({ a, b }) => {
        const output = { result: a * b };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Register an echo tool
server.registerTool(
    'echo',
    {
        title: 'Echo Tool',
        description: 'Echoes back the provided message',
        inputSchema: { message: z.string() },
        outputSchema: { echo: z.string() }
    },
    async ({ message }) => {
        const output = { echo: `Tool echo: ${message}` };
        return {
            content: [{ type: 'text', text: JSON.stringify(output) }],
            structuredContent: output
        };
    }
);

// Register a dynamic greeting resource
server.registerResource(
    'greeting',
    new ResourceTemplate('greeting://{name}', { list: undefined }),
    {
        title: 'Greeting Resource',
        description: 'Dynamic greeting generator for any name'
    },
    async (uri, { name }) => ({
        contents: [
            {
                uri: uri.href,
                text: `Hello, ${name}! Welcome to the MCP server.`
            }
        ]
    })
);

// Register a static info resource
server.registerResource(
    'info',
    new ResourceTemplate('info://server', { list: undefined }),
    {
        title: 'Server Info',
        description: 'Information about this MCP server'
    },
    async (uri) => ({
        contents: [
            {
                uri: uri.href,
                text: 'This is a sample streamable HTTP MCP server implementation using the TypeScript SDK.'
            }
        ]
    })
);

// Set up Express and HTTP transport
const app = express();
app.use(express.json());

app.post('/mcp', async (req, res) => {
    // Create a new transport for each request to prevent request ID collisions
    // Different clients may use the same JSON-RPC request IDs, which would
    // cause responses to be routed to the wrong HTTP connections if the
    // transport state is shared.
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true
    });

    res.on('close', () => {
        transport.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', server: 'sample-http-mcp-server', version: '1.0.0' });
});

// Root endpoint with information
app.get('/', (req, res) => {
    res.json({
        name: 'Sample HTTP MCP Server',
        version: '1.0.0',
        description: 'A sample streamable HTTP MCP server implementation',
        endpoints: {
            mcp: '/mcp (POST)',
            health: '/health (GET)'
        },
        usage: 'Connect using an MCP client to http://localhost:3000/mcp'
    });
});

const port = parseInt(process.env.PORT || '3000');
app.listen(port, () => {
    console.log(`Sample HTTP MCP Server running on http://localhost:${port}`);
    console.log(`MCP endpoint: http://localhost:${port}/mcp`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log('');
    console.log('Available tools:');
    console.log('  - add: Add two numbers');
    console.log('  - multiply: Multiply two numbers');
    console.log('  - echo: Echo a message');
    console.log('');
    console.log('Available resources:');
    console.log('  - greeting://{name}: Dynamic greeting for any name');
    console.log('  - info://server: Server information');
    console.log('');
    console.log('Connect using an MCP client like:');
    console.log('  - MCP Inspector: npx @modelcontextprotocol/inspector');
    console.log('  - Claude Code: claude mcp add --transport http my-server http://localhost:3000/mcp');
}).on('error', (error) => {
    console.error('Server error:', error);
    process.exit(1);
});
