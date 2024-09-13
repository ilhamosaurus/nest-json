import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getUserByContext = (context: ExecutionContext): UserRequest => {
  if (context.getType() !== 'http') {
    return null;
  }

  const request = context.switchToHttp().getRequest();
  return request.user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    return getUserByContext(context);
  },
);
