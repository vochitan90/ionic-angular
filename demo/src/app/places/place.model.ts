export class Place {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public imageUrl: string,
    public price: number,
    public availableForm: Date,
    public availableTo: Date,
    public userId: string // who created that place
  ) // because users should only be able to book places they haven't created
  {}
}
