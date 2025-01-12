import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';

// Define types for our context value

type AllowedActions = 'add-element' | 'idle';
interface MenuItemContextState {
  currentAction: AllowedActions;
}

// type MenuItemContextAction =
//   | { type: 'added'; id: number; text: string }
//   | { type: 'changed'; task: Task }
//   | { type: 'deleted'; id: number };

type MenuItemContextAction =
  | { type: 'current'; value: AllowedActions }
  | { type: 'xd' };

// Create the context with a default value
const MenuItemContext = createContext<MenuItemContextState | null>(null);
const MenuItemDispatchContext =
  createContext<Dispatch<MenuItemContextAction> | null>(null);

function reducer(
  state: MenuItemContextState,
  action: MenuItemContextAction,
): MenuItemContextState {
  switch (action.type) {
    case 'current':
      return { ...state, currentAction: action.value };
    default:
      return state;
  }
}

// Create a provider component
export const MenuItemProvider = ({ children }: PropsWithChildren) => {
  const [state, dispatch] = useReducer(reducer, { currentAction: 'idle' });

  return (
    <MenuItemContext.Provider value={state}>
      <MenuItemDispatchContext.Provider value={dispatch}>
        {children}
      </MenuItemDispatchContext.Provider>
    </MenuItemContext.Provider>
  );
};

// Custom hook for using the context
export const useMenuItem = (): MenuItemContextState => {
  const context = useContext(MenuItemContext);
  if (!context) {
    throw new Error('useMenuItem must be used within a MenuItemProvider');
  }
  return context;
};

export function useMenuItemDispatch(): Dispatch<MenuItemContextAction> {
  const context = useContext(MenuItemDispatchContext);
  if (context === null) {
    throw new Error('useTasksDispatch must be used within a TasksProvider');
  }
  return context;
}
