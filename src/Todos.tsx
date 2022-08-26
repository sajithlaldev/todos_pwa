import type {Component, JSX} from 'solid-js';
import type {ITodo} from './store';

import {createSignal, createEffect, For, Show} from 'solid-js';
import {nanoid} from 'nanoid';
import {createDexieArrayQuery} from 'solid-dexie';

import {Input, Button, Box, Heading, Flex} from '@hope-ui/solid';

import Todo from './Todo';
import {db} from './store';

const Todos: Component = () => {
  const [text, setText] = createSignal('');
  const [isLoading, setIsLoading] = createSignal(false);
  const todos = createDexieArrayQuery(() => db.todos.toArray());
  console.log(todos);

  const handleSubmit: JSX.EventHandlerUnion<HTMLFormElement, Event & {submitter: HTMLElement}> = (e) => {
    e.preventDefault();
    if (text().trim() === '') return;
    const newTodo: ITodo = {
      id: nanoid(),
      text: text().trim(),
      checked: false,
    };
    setIsLoading(true);
    db.todos.add(newTodo).then((resp) => {
      setIsLoading(false);
      setText('');
      console.log(text(), ' saved!', resp);
    });
  };

  createEffect(() => {
    console.log('Working with: ', todos);
  });

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box d="flex" gap="$2" my="$4">
          <Input
            value={text()}
            onChange={(e) => setText(e.currentTarget.value)}
            width="auto"
            placeholder="Some todo..."
          />
          <Button type="submit" loading={isLoading()} loadingText="Saving...">Add</Button>
        </Box>
      </form>
      <Heading size="2xl" my="$4" textAlign="center">My Todos</Heading>
      <Flex gap="$2" flexDirection="column" width="$full" maxW="$72" mx="auto">
        <For each={todos}>
          {(todo) => <Todo todo={todo} />}
        </For>
        <Show when={todos.length === 0}>
          <Box w="$5" h="$5" bg="teal" />
        </Show>
      </Flex>
    </>
  );
};

export default Todos;
