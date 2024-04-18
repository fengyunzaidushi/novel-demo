

export function streamAsyncIterator(stream: ReadableStream) {
    const reader = stream.getReader();
    return {
      next() {
        return reader.read();
      },
      return() {
        reader.releaseLock();
        return {
          value: {},
        };
      },
      [Symbol.asyncIterator]() {
        return this;
      },
    };
  }
  