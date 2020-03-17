class PlaceNotFound extends Error {
  constructor(message: string) {
    super(message);

    this.name = this.constructor.name;
  }
}

export default PlaceNotFound;
