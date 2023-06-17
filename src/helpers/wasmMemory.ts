var wasmMemory: WebAssembly.Memory;

export function memoryInit(mem: WebAssembly.Memory) 
{
    wasmMemory = mem;
}

const pageSize = (64 * 1024);

function malloc(size: number)
{
    const offset = wasmMemory.grow(size / pageSize + size % pageSize);
    return offset;
}

function free(buf: number)
{
    //TODO
}

export function memorySymbols()
{
    return {
        malloc: malloc,
        free: free
    }
}

export default
{
}