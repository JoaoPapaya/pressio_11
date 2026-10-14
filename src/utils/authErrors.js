// Traduz mensagens do Supabase Auth para algo que a pessoa entenda.
export function friendlyAuthError(error) {
  const msg = (error?.message || '').toLowerCase();
  if (msg.includes('invalid login credentials')) return 'E-mail ou senha incorretos.';
  if (msg.includes('already registered') || msg.includes('already been registered')) return 'Este e-mail já está cadastrado. Tente entrar.';
  if (msg.includes('email not confirmed')) return 'Confirme seu e-mail pelo link que enviamos antes de entrar.';
  if (msg.includes('password should be') || msg.includes('weak password')) return 'Senha fraca. Use ao menos 6 caracteres.';
  if (msg.includes('same password') || msg.includes('different from the old')) return 'A nova senha deve ser diferente da atual.';
  if (msg.includes('rate limit') || msg.includes('too many')) return 'Muitas tentativas. Aguarde um pouco e tente de novo.';
  if (msg.includes('network') || msg.includes('failed to fetch')) return 'Sem conexão com o servidor. Verifique sua internet.';
  if (msg.includes('invalid email')) return 'Informe um e-mail válido.';
  return error?.message || 'Algo deu errado. Tente novamente.';
}
