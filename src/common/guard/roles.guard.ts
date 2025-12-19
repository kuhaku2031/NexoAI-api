import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enum/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private roleHierarchy: Record<UserRole, number> = {
    [UserRole.OWNER]: 3,
    [UserRole.MANAGER]: 2,
    [UserRole.EMPLOYEE]: 1,
  };

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const userLevel = this.roleHierarchy[user.role];

    if (!userLevel) {
      return false;
    }

    const minRequiedRoles = Math.min(
      ...requiredRoles.map((role) => this.roleHierarchy[role]),
    );
    return userLevel >= minRequiedRoles;
  }
}
