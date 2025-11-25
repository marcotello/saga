import { Injectable, signal } from "@angular/core";
import { User } from "../models/models";


@Injectable({
    providedIn: 'root'
  })
  export class UserService {

    private readonly _user = signal<User | null>(null);

    readonly user = this._user.asReadonly();

    setUser(user: User | null): void {
        this._user.set(user);
    }
  }