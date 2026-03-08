import { BookingStatus } from '../../../generated/prisma/client.js';

interface BookingState {
  confirm(context: BookingContext): void
  complete(context: BookingContext): void
  cancel(context: BookingContext): void
}

class BookingContext {

  private state: BookingState

  constructor(public status: BookingStatus) {
    this.state = BookingStateFactory.create(status)
  }

  setState(state: BookingState, status: BookingStatus) {
    this.state = state
    this.status = status
  }

  confirm() {
    this.state.confirm(this)
  }

  complete() {
    this.state.complete(this)
  }

  cancel() {
    this.state.cancel(this)
  }
}

class PendingState implements BookingState {

  confirm(context: BookingContext) {
    context.setState(new ConfirmedState(), "CONFIRMADA")
  }

  complete() {
    throw new Error("No puedes completar una reserva pendiente")
  }

  cancel(context: BookingContext) {
    context.setState(new CancelledState(), "CANCELADA")
  }
}

class ConfirmedState implements BookingState {

  confirm() {
    throw new Error("La reserva ya está confirmada")
  }

  complete(context: BookingContext) {
    context.setState(new CompletedState(), "COMPLETADA")
  }

  cancel(context: BookingContext) {
    context.setState(new CancelledState(), "CANCELADA")
  }
}

class CompletedState implements BookingState {

  confirm() {
    throw new Error("La reserva ya está completada")
  }

  complete() {
    throw new Error("La reserva ya está completada")
  }

  cancel() {
    throw new Error("No puedes cancelar una reserva completada")
  }
}

class CancelledState implements BookingState {

  confirm() {
    throw new Error("La reserva está cancelada")
  }

  complete() {
    throw new Error("La reserva está cancelada")
  }

  cancel() {
    throw new Error("La reserva ya está cancelada")
  }
}

class BookingStateFactory {

  static create(status: BookingStatus): BookingState {

    switch (status) {

      case "PENDIENTE":
        return new PendingState()

      case "CONFIRMADA":
        return new ConfirmedState()

      case "COMPLETADA":
        return new CompletedState()

      case "CANCELADA":
        return new CancelledState()

    }

  }

}