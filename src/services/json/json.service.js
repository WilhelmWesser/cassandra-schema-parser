class JsonService {
  stringify(toStringify) {
    return JSON.stringify(toStringify);
  }

  parse(toParse) {
    return JSON.parse(toParse);
  }
}

export { JsonService };
