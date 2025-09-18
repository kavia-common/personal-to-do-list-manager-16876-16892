<script lang="ts">
  import { onMount } from 'svelte';
  import '../app.css';
  import TaskItem from '$lib/components/TaskItem.svelte';
  import FilterBar, { type Filter } from '$lib/components/FilterBar.svelte';
  import { createTask, deleteTask, listTasks, updateTask, type Task } from '$lib/api';
  import { toasts, toast } from '$lib/notify';

  let tasks: Task[] = [];
  let loading = true;
  let creating = false;
  let newTitle = '';
  let filter: Filter = 'all';

  const filtered = () => {
    if (filter === 'active') return tasks.filter(t => !t.completed);
    if (filter === 'completed') return tasks.filter(t => t.completed);
    return tasks;
  };

  const counts = () => ({
    total: tasks.length,
    active: tasks.filter(t => !t.completed).length,
    completed: tasks.filter(t => t.completed).length
  });

  async function refresh() {
    loading = true;
    try {
      tasks = await listTasks();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load tasks';
      toast(msg, 'error', 4000);
    } finally {
      loading = false;
    }
  }

  onMount(refresh);

  async function addTask() {
    const title = newTitle.trim();
    if (!title) return;
    creating = true;
    try {
      const created = await createTask(title);
      tasks = [created, ...tasks];
      newTitle = '';
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to create task';
      toast(msg, 'error');
    } finally {
      creating = false;
    }
  }

  async function toggleTask(id: string, completed: boolean) {
    const prev = tasks.slice();
    tasks = tasks.map(t => (t.id === id ? { ...t, completed } : t));
    try {
      await updateTask(id, { completed });
    } catch (e: unknown) {
      tasks = prev;
      const msg = e instanceof Error ? e.message : 'Failed to update task';
      toast(msg, 'error');
    }
  }

  async function editTask(id: string, title: string) {
    const prev = tasks.slice();
    tasks = tasks.map(t => (t.id === id ? { ...t, title } : t));
    try {
      await updateTask(id, { title });
    } catch (e: unknown) {
      tasks = prev;
      const msg = e instanceof Error ? e.message : 'Failed to rename task';
      toast(msg, 'error');
    }
  }

  async function removeTask(id: string) {
    const prev = tasks.slice();
    tasks = tasks.filter(t => t.id !== id);
    try {
      await deleteTask(id);
    } catch (e: unknown) {
      tasks = prev;
      const msg = e instanceof Error ? e.message : 'Failed to delete task';
      toast(msg, 'error');
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  }
</script>

<svelte:head>
  <title>Personal To‑Do | Ocean Professional</title>
  <meta name="description" content="Create, update, complete, and manage your tasks with a modern, minimalist Svelte app." />
</svelte:head>

<div class="container">
  <header class="card header hero">
    <div class="hero-content">
      <div class="hero-text">
        <h1>My Tasks</h1>
        <p class="muted">Stay organized with a clean and modern to‑do list.</p>
      </div>
      <div class="hero-stats">
        <span class="tag">Total: {counts().total}</span>
        <span class="tag">Active: {counts().active}</span>
        <span class="tag">Done: {counts().completed}</span>
      </div>
    </div>
    <div class="hero-input row">
      <input
        class="input"
        placeholder="Add a new task…"
        bind:value={newTitle}
        on:keydown={onKeydown}
        aria-label="New task title"
      />
      <button class="btn" on:click={addTask} disabled={creating || !newTitle.trim()}>
        {creating ? 'Adding…' : 'Add'}
      </button>
    </div>
  </header>

  <section class="card list">
    {#if loading}
      <div class="loading center">
        <div class="spinner" aria-hidden="true"></div>
        <span class="muted">Loading tasks…</span>
      </div>
    {:else if tasks.length === 0}
      <div class="empty center">
        <div class="emoji">🌊</div>
        <p class="muted">No tasks yet. Create your first task above.</p>
      </div>
    {:else}
      <ul class="items" role="list">
        {#each filtered() as task (task.id)}
          <TaskItem
            {task}
            onToggle={toggleTask}
            onDelete={removeTask}
            onEdit={editTask}
          />
        {/each}
      </ul>
    {/if}
  </section>

  <FilterBar value={filter} counts={counts()} onChange={(v) => (filter = v)} />

  <footer class="footer-note center small" style="margin-top: 16px;">
    Tip: Press Enter to quickly add a task.
  </footer>
</div>

<!-- Toasts -->
{#if $toasts.length}
  <div class="toast-wrap">
    {#each $toasts as t (t.id)}
      <div class="toast {t.type ?? 'info'} fade-in">
        {t.message}
      </div>
    {/each}
  </div>
{/if}

<style>
  .hero {
    padding: 18px;
    overflow: hidden;
  }
  .hero-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .hero-text h1 {
    margin: 0;
    font-size: 28px;
    letter-spacing: -0.01em;
  }
  .hero-stats {
    display: inline-flex;
    gap: 8px;
  }
  .hero-input {
    margin-top: 12px;
  }

  .list {
    margin-top: 16px;
    padding: 6px;
  }

  .items {
    list-style: none;
    margin: 0;
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .loading {
    gap: 10px;
    padding: 24px 0;
  }
  .spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(37,99,235,0.25);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 900ms linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .empty {
    padding: 26px 0;
  }
  .emoji {
    font-size: 36px;
    margin-bottom: 8px;
  }

  .toast-wrap {
    position: fixed;
    right: 18px;
    bottom: 18px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    z-index: 50;
  }
  .toast {
    padding: 12px 14px;
    border-radius: 12px;
    color: #0f172a;
    background: #ffffff;
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-md);
    min-width: 200px;
  }
  .toast.error {
    border-color: rgba(239,68,68,0.35);
    background: linear-gradient(0deg, rgba(239,68,68,0.06), rgba(239,68,68,0.06)), #fff;
    color: #7f1d1d;
  }
  .toast.success {
    border-color: rgba(245,158,11,0.35);
    background: linear-gradient(0deg, rgba(245,158,11,0.08), rgba(245,158,11,0.08)), #fff;
    color: #78350f;
  }

  @media (max-width: 640px) {
    .hero-content { flex-direction: column; align-items: flex-start; gap: 6px; }
    .hero-stats { align-self: flex-start; }
    .hero-input { flex-direction: column; align-items: stretch; }
    .hero-input .btn { width: 100%; }
  }
</style>
