import buffer from "node:buffer";
if (!buffer.SlowBuffer) buffer.SlowBuffer = buffer.Buffer;
if (!globalThis.SlowBuffer) globalThis.SlowBuffer = buffer.Buffer;
