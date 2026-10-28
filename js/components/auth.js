export function initAuth(dialogId = 'dialog-auth') {
  const dialog = document.getElementById(dialogId);
  if (!dialog) return;

  dialog.innerHTML = `
    <div class="modal-surface auth-surface" role="document">
      <div class="modal-header">
        <div class="modal-header-titles">
          <span class="modal-badge">SECURE CREW ACCESS / SMS V4.2</span>
          <h2 class="modal-title" id="auth-title">Sign in to SkyShield</h2>
          <p class="modal-subtitle">Access your safety operations workspace.</p>
        </div>
        <button type="button" class="btn-close-modal" data-auth-close aria-label="Close">✕</button>
      </div>
      <div class="auth-tabs" role="tablist">
        <button class="auth-tab active" data-auth-mode="login" role="tab">SIGN IN</button>
        <button class="auth-tab" data-auth-mode="register" role="tab">REGISTER</button>
      </div>
      <form id="auth-form" class="auth-form">
        <div class="form-group">
          <label for="auth-email">Work email <span class="required">*</span></label>
          <input class="form-control" id="auth-email" type="email" autocomplete="email" required placeholder="name@airline.com">
          <small class="field-helper">Use your company-issued account.</small>
        </div>
        <div class="form-group auth-name-field hidden">
          <label for="auth-name">Full name <span class="required">*</span></label>
          <input class="form-control" id="auth-name" type="text" autocomplete="name" placeholder="Alex Morgan">
        </div>
        <div class="form-group">
          <label for="auth-password">Password <span class="required">*</span></label>
          <div class="password-field">
            <input class="form-control" id="auth-password" type="password" minlength="8" autocomplete="current-password" required placeholder="Minimum 8 characters">
            <button class="password-toggle" type="button" aria-label="Show password">SHOW</button>
          </div>
        </div>
        <label class="remember-row"><input type="checkbox" id="auth-remember"> Keep me signed in</label>
        <p class="auth-message" role="status" aria-live="polite"></p>
        <button class="btn btn-primary btn-block auth-submit" type="submit">CONTINUE SECURELY</button>
        <button class="auth-link" type="button" data-forgot>Password recovery</button>
      </form>
      <p class="auth-legal">Authentication, roles, MFA, and session expiry must be enforced by the backend.</p>
    </div>`;

  const form = dialog.querySelector('#auth-form');
  const nameField = dialog.querySelector('.auth-name-field');
  const title = dialog.querySelector('#auth-title');
  const submit = dialog.querySelector('.auth-submit');
  const message = dialog.querySelector('.auth-message');
  dialog.querySelector('[data-auth-close]').addEventListener('click', () => dialog.close());

  dialog.querySelectorAll('[data-auth-mode]').forEach(tab => tab.addEventListener('click', () => {
    const register = tab.dataset.authMode === 'register';
    dialog.querySelectorAll('[data-auth-mode]').forEach(item => item.classList.toggle('active', item === tab));
    nameField.classList.toggle('hidden', !register);
    dialog.querySelector('#auth-name').required = register;
    title.textContent = register ? 'Create your SkyShield account' : 'Sign in to SkyShield';
    submit.textContent = register ? 'CREATE SECURE ACCOUNT' : 'CONTINUE SECURELY';
    message.textContent = '';
  }));
  dialog.querySelector('.password-toggle').addEventListener('click', event => {
    const input = dialog.querySelector('#auth-password');
    input.type = input.type === 'password' ? 'text' : 'password';
    event.currentTarget.textContent = input.type === 'password' ? 'SHOW' : 'HIDE';
  });
  dialog.querySelector('[data-forgot]').addEventListener('click', () => {
    message.className = 'auth-message success';
    message.textContent = 'Recovery instructions will be sent by the authentication service.';
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    submit.disabled = true;
    submit.textContent = 'AUTHENTICATING…';
    message.textContent = '';
    await new Promise(resolve => setTimeout(resolve, 650));
    submit.disabled = false;
    submit.textContent = 'CONTINUE SECURELY';
    message.className = 'auth-message success';
    message.textContent = 'Demo mode: connect this form to POST /api/auth/login or /api/auth/register.';
  });
}
