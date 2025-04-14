export enum RequestStateEnum {
  NotStarted = 0,
  Started = 1,
  ComparisonTableCreated = 2,
  ReverseAuctionPending = 3,
  ReverseAuctionComplated = 4,
  AllocationCreated = 5,
  ComparisonTableCompleted = 6,
  PendingApprovals = 7,
  Approved = 8,
  Rejected = 9,
  Cancelled = 10,
  Completed = 11
}

export enum OfferStatus {
  PendingOffer = 1,
  OfferSubmitted = 2,
  OfferRequestRejected = 3
}


export enum ReverseAuctionStatusEnum
{
    NotStarted = 0,
    Started = 1,
    Paused = 2,
    Ended = 3,
    Cancelled = 4
}

export enum ApprovalStatus
{
    Pending = 1,
    Approved = 2,
    Rejected = 3,
}

export enum ContractStatusEnum
{
    NotStarted = 1,
    Started = 2,
    OfferApproved = 3,
    OfferRejected = 4,
    PendingApprovals = 5,
    ContractApproved = 6
}
