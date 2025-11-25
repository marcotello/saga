import { Injectable, inject, signal } from "@angular/core";
import { User } from "../models/models";
import { UserHttpMockService } from "../mock-api/user-http-mock-service";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
  })
  export class UserService {

    private readonly _user = signal<User | null>(null);
    private readonly userHttpMockService = inject(UserHttpMockService);

    readonly user = this._user.asReadonly();

    setUser(user: User | null): void {
        this._user.set(user);
    }

    updateProfileById(user: User): Observable<User> {
        return this.userHttpMockService.updateProfileById(user.id, user);
    }
  }