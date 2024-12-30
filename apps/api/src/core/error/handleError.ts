export class HandleError extends Error {
  constructor(
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private data: any = {}
  ) {
    super(message)
    this.name = 'HandleError'

    if (message === 'unexpected_error') {
      console.error('>>> Unexpected Error: ', data)
    }
  }

  getMessage() {
    return this.message
  }

  toJson() {
    return {
      message: this.message,
      data: this.data
    }
  }

  override toString() {
    return this.message
  }
}
