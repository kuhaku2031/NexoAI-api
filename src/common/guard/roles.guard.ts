import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../enum/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private roleHierarchy: Record<UserRole, UserRole[]> = {
    [UserRole.OWNER]: [UserRole.OWNER],
    [UserRole.MANAGER]: [UserRole.MANAGER, UserRole.OWNER],
    [UserRole.EMPLOYEE]: [UserRole.EMPLOYEE, UserRole.MANAGER, UserRole.OWNER],
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
    const userRolesLevel = this.roleHierarchy[user.role];

    if (!userRolesLevel) {
      return false;
    }

    return requiredRoles.some(
      (role) => userRolesLevel >= this.roleHierarchy[role],
    );
  }
}
