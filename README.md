# MCP and Agent Samples

This repository contains sample implementations for the Model Context Protocol (MCP).

## Sample HTTP MCP Server

A sample streamable HTTP MCP server implementation using the [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk).

### Features

This sample server demonstrates:

- **Streamable HTTP Transport**: Modern HTTP-based transport for MCP communication
- **Tools**: Multiple example tools including calculator and echo functionality
- **Resources**: Dynamic and static resources with URI templates
- **Express Integration**: Easy integration with Express.js for HTTP handling

### Installation

```bash
npm install
```

### Running the Server

**Development mode** (with hot reload):
```bash
npm run dev
```

**Build and run**:
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` by default. You can change the port by setting the `PORT` environment variable:

```bash
PORT=8080 npm run dev
```

### Available Endpoints

- `POST /mcp` - Main MCP endpoint for client connections
- `GET /health` - Health check endpoint
- `GET /` - Server information

### Tools

The server provides the following tools:

1. **add** - Add two numbers together
   - Input: `{ a: number, b: number }`
   - Output: `{ result: number }`

2. **multiply** - Multiply two numbers together
   - Input: `{ a: number, b: number }`
   - Output: `{ result: number }`

3. **echo** - Echo back a message
   - Input: `{ message: string }`
   - Output: `{ echo: string }`

### Resources

The server exposes the following resources:

1. **greeting://{name}** - Dynamic greeting resource
   - Example: `greeting://Alice` returns "Hello, Alice! Welcome to the MCP server."

2. **info://server** - Static server information
   - Returns information about the MCP server

### Connecting to the Server

You can connect to this server using any MCP client that supports streamable HTTP:

#### MCP Inspector
```bash
npx @modelcontextprotocol/inspector
```
Then connect to: `http://localhost:3000/mcp`

#### Claude Code
```bash
claude mcp add --transport http my-server http://localhost:3000/mcp
```

#### VS Code
```bash
code --add-mcp "{\"name\":\"my-server\",\"type\":\"http\",\"url\":\"http://localhost:3000/mcp\"}"
```

#### Cursor
Click this deeplink: [cursor://anysphere.cursor-deeplink/mcp/install?name=my-server&config=eyJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvbWNwIn0%3D](cursor://anysphere.cursor-deeplink/mcp/install?name=my-server&config=eyJ1cmwiOiJodHRwOi8vbG9jYWxob3N0OjMwMDAvbWNwIn0%3D)

### Testing the Server

Once the server is running, you can test it manually:

1. **Health Check**:
   ```bash
   curl http://localhost:3000/health
   ```

2. **Server Info**:
   ```bash
   curl http://localhost:3000/
   ```

3. **MCP Endpoint** (requires proper MCP client or manual JSON-RPC request):
   ```bash
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
   ```

### Architecture

This implementation follows the MCP specification using:

- **McpServer**: Core MCP server instance handling protocol compliance
- **StreamableHTTPServerTransport**: HTTP transport layer for request/response handling
- **Express**: Web framework for HTTP server
- **Zod**: Schema validation for tool inputs and outputs

### Development

**Type checking**:
```bash
npm run type-check
```

**Build**:
```bash
npm run build
```

### References

- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Specification](https://spec.modelcontextprotocol.io)

### License

MIT