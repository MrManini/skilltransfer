import { MentorshipStep } from "../../../generated/prisma/client.js"

// Iterator (interfaz)

export interface Iterator<T> {
  hasNext(): boolean
  next(): T | null
}

// ConcreteIterator

export class MentorshipStepIterator implements Iterator<MentorshipStep> {

  private index = 0

  constructor(private steps: MentorshipStep[]) {}

  hasNext(): boolean {
    return this.index < this.steps.length
  }

  next(): MentorshipStep | null {

    if (!this.hasNext()) {
      return null
    }

    const step = this.steps[this.index]
    this.index++

    return step
  }

}