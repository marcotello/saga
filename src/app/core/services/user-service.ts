import { Injectable, inject, signal } from "@angular/core";
import { User } from "../models/models";
import { UserHttpMockService } from "../mock-api/user-http-mock-service";


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

    updateProfileById(user: User): void {
        this.userHttpMockService.updateProfileById(user.id, user).subscribe({
            next: (updatedUser: User) => {
                this._user.set(updatedUser);
            },
            error: () => {
                // Error handling will be implemented later with an error service
            }
        });
    }
  }