'use client';
import { useState } from 'react';
import styles from './LoginForm.module.css';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const router = useRouter();

  async function handleSubmitForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setNameError('');
    setPasswordError('');
    setSubmitError('');
    let isValid = true;

    if (!username.trim()) {
      setNameError('Username is required');
      isValid = false;
    }
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!isValid) return;
    setIsLoading(true);

    try {
      // Nextauth sign-in call.
      const result = await signIn('credentials', {
        username: username.trim(),
        password: password,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/');
        router.refresh();
        return;
      }

      if (result?.error) {
        setSubmitError('Invalid username or password');
      } else {
        setSubmitError('Something went wrong');
      }
    } catch (err) {
      console.error(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmitForm} noValidate>
      <div className={styles.formContainer}>
        <div className={styles.usernameContainer}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
          />
          {nameError && <p>{nameError}</p>}
        </div>

        <div className={styles.passwordContainer}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            autoComplete="current-password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p>{passwordError}</p>}
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Sign in'}
        </button>
        {submitError && <p>{submitError}</p>}
      </div>
    </form>
  );
}
