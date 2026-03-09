import { MentorshipStep } from "../../../generated/prisma/client.js"
import { MentorshipStepIterator } from "./iterator.class.js"

export class MentorshipPlan {

  constructor(private steps: MentorshipStep[]) {}

  createIterator(): MentorshipStepIterator {
    return new MentorshipStepIterator(this.steps)
  }

}