export interface User {
  id: string
  email: string
  password: string
  nickname: string
}

const users: User[] = []

export function addUser(
  email: string,
  password: string,
  nickname: string = ''
): User {
  const normalizedEmail = email.trim().toLowerCase()
  const user: User = {
    id: crypto.randomUUID(),
    email: normalizedEmail,
    password: password.trim(),
    nickname: nickname.trim() || '',
  }
  users.push(user)
  return user
}

export function findUserByEmail(email: string): User | undefined {
  const normalized = email.trim().toLowerCase()
  return users.find((u) => u.email === normalized)
}

export function findUserById(id: string): User | undefined {
  return users.find((u) => u.id === id)
}
