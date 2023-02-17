class LoggerService {
  showInLog(message) {
    console.log(message);
  }

  showInErrors(message) {
    console.error(message);
  }
}

export { LoggerService };
