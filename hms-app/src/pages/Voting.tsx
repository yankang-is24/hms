import React, { useState } from 'react'
import { Button, Title, useMantineTheme } from '@mantine/core'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import ideaData from '../test/TestIdeaData'
import IdeaCardFoldable from '../components/IdeaCardFoldable'

const columnsFromBackend = {
  ['1']: {
    name: 'All ideas',
    items: [...ideaData],
  },
  ['2']: {
    name: 'Voting',
    items: [],
  },
}

const onDragEnd = (result: any, columns: any, setColumns: any) => {
  if (!result.destination) return
  const { source, destination } = result

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const sourceItems = [...sourceColumn.items]
    const destItems = [...destColumn.items]
    const [removed] = sourceItems.splice(source.index, 1)
    destItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    })
  } else {
    const column = columns[source.droppableId]
    const copiedItems = [...column.items]
    const [removed] = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0, removed)
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    })
  }
}

export default function Voting() {
  const [columns, setColumns] = useState(columnsFromBackend)
  const theme = useMantineTheme()

  const backgroundColor =
    theme.colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.dark[1]

  console.log(theme)

  function submitVote() {
    console.log('voting submit is: ')
    console.log(columns['2'].items)
  }

  return (
    <>
      <Button color={'green'} size={'lg'}>
        Submit vote
      </Button>
      <div
        style={{ display: 'flex', justifyContent: 'center', height: '100%' }}
      >
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
                key={columnId}
              >
                <Title order={2}>{column.name}</Title>
                <div style={{ margin: 8 }}>
                  <Droppable droppableId={columnId} key={columnId}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          style={{
                            background: snapshot.isDraggingOver
                              ? 'lightgrey'
                              : backgroundColor,
                            padding: 4,
                            width: 340,
                            minHeight: 500,
                            borderRadius: 10,
                          }}
                        >
                          {column.items.map((item, index) => {
                            return (
                              <Draggable
                                key={item.id}
                                draggableId={item.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        userSelect: 'none',
                                        margin: '10px',
                                        minHeight: '50px',
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      <IdeaCardFoldable
                                        idea={item}
                                        index={index}
                                      />
                                    </div>
                                  )
                                }}
                              </Draggable>
                            )
                          })}
                          {provided.placeholder}
                        </div>
                      )
                    }}
                  </Droppable>
                </div>
              </div>
            )
          })}
        </DragDropContext>
      </div>
    </>
  )
}
