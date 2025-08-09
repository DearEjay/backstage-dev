'use client'

import { createProject } from './actions'
import { useRouter } from 'next/navigation'

export default function ProjectForm() {
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await createProject(formData);
    router.refresh();
  }

  return (
    <form
      className="flex flex-wrap gap-2 items-center"
      onSubmit={handleSubmit}
    >
      <input
        name="title"
        placeholder="New project title"
        className="flex-1 rounded border px-3 py-2"
        required
      />

      <select name="type" className="rounded border px-2 py-2">
        <option value="single">Single</option>
        <option value="ep">EP</option>
        <option value="album">Album</option>
      </select>

      <select
        name="status"
        className="rounded border px-2 py-2"
        defaultValue="not_released"
      >
        <option value="not_released">Not released</option>
        <option value="released">Released</option>
      </select>

      <button className="rounded bg-black text-white px-3 py-2">
        Create
      </button>
    </form>
  )
}