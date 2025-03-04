import { z } from 'zod';

import { userService } from 'resources/user';

import { validateMiddleware } from 'middlewares';
import { authService } from 'services';

import config from 'config';

import { AppKoaContext, AppRouter, Next, User } from 'types';

const schema = z.object({
  id: z.string().min(1, 'User ID is required'),
});

interface ValidatedData extends z.infer<typeof schema> {
  user: User;
}

async function validator(ctx: AppKoaContext<ValidatedData>, next: Next) {
  const { id } = ctx.validatedData;

  const user = await userService.findUnique({
    where: { id: +id },
  });

  ctx.assertClientError(user, { id: 'User does not exist' });

  ctx.validatedData.user = user;
  await next();
}

async function handler(ctx: AppKoaContext<ValidatedData>) {
  const { user } = ctx.validatedData;

  await authService.setTokens(ctx, user.id, true);

  ctx.redirect(config.WEB_URL);
}

export default (router: AppRouter) => {
  router.post('/shadow-login', validateMiddleware(schema), validator, handler);
};
