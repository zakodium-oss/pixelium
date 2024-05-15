import styled from '@emotion/styled';
import { createRef, RefObject, useCallback } from 'react';
import { useKbs } from 'react-kbs';

interface FastSelectorProps<T> {
  options: T[];
  selected: T | undefined;
  setSelected: (value: T) => void;
  defaultItem?: T | undefined;
}

const Container = styled.div`
  overflow-y: auto;
  height: 100%;
`;

const List = styled.ul`
  display: flex;
  flex-direction: column;
  border-radius: 6px;
`;

const ListElement = styled.li<{ selected: boolean; defaultItem: boolean }>`
  padding: 10px;
  border: 1px solid #9e9e9e;
  border-top-width: 0px;
  width: 100%;
  height: 100%;
  font-size: 1.125rem;
  display: flex;
  justify-content: center;
  align-items: center;

  &:first-of-type {
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-top-width: 1px;
  }

  &:last-of-type {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  background-color: ${({ selected, defaultItem }) =>
    selected ? 'royalblue' : defaultItem ? 'lightgray' : 'white'};
  color: ${({ selected }) => (selected ? 'white' : 'black')};
`;

export default function FastSelector<T extends string>({
  options,
  selected,
  setSelected,
  defaultItem,
}: FastSelectorProps<T>) {
  // eslint-disable-next-line unicorn/no-array-reduce
  const refs: { [key: string]: RefObject<HTMLLIElement> } = options.reduce(
    (acc, value) => {
      acc[value as string] = createRef();
      return acc;
    },
    {},
  );

  const select = useCallback(
    (value: T) => {
      setSelected(value);
      refs[value as string].current?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    },
    [refs, setSelected],
  );

  const shortcuts = useKbs([
    {
      shortcut: 'ArrowUp',
      handler: () => {
        if (selected === undefined) return select(options[0]);
        const index = options.indexOf(selected);
        if (index === -1) return;
        if (index === 0) return;
        select(options[index - 1]);
      },
    },
    {
      shortcut: 'ArrowDown',
      handler: () => {
        if (selected === undefined) {
          const last = options.at(-1) || options[0];
          return select(last);
        }

        const index = options.indexOf(selected);
        if (index === -1) return;
        if (index === options.length - 1) return;
        select(options[index + 1]);
      },
    },
  ]);

  return (
    <Container {...shortcuts}>
      <List>
        {options.map((option) => (
          <ListElement
            key={option}
            selected={option === selected}
            onClick={() => setSelected(option)}
            ref={refs[option]}
            defaultItem={option === defaultItem}
          >
            {option}
          </ListElement>
        ))}
      </List>
    </Container>
  );
}
