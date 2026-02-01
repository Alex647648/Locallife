# AI Programming Constraints & Rules

This project operates under strict AI programming constraints loaded from `trae_adapted_project`.

## 1. Core Principles (CRITICAL)
- **Immutability**: NEVER mutate objects/arrays. Always use spread syntax (`...`) or immutable patterns.
- **Small Files**: Keep files under 400 lines. Extract utilities and components.
- **No Magic Numbers**: Use named constants.
- **Strict Typing**: No `any`. Define interfaces for everything.

## 2. Security
- **No Hardcoded Secrets**: Use `process.env`.
- **Input Validation**: ALL user input must be validated (e.g., with `zod`).
- **Error Handling**: Comprehensive `try/catch` with user-friendly messages.

## 3. Testing & TDD
- **Test First**: Write tests before implementation (Red-Green-Refactor).
- **Coverage**: Aim for 80%+ coverage.
- **Tools**: Use `vitest` for unit tests, `playwright` for E2E.

## 4. Frontend (React)
- **State**: Use `TanStack Query` for server state, `useState` for local UI state. Avoid global stores (Redux/Zustand) unless necessary.
- **Components**: Functional components with typed props.
- **Hooks**: Extract logic into custom hooks.

## 5. Workflow (SOP L4)
- **User Stories**: Use Connextra format ("As a [role], I want [feature], so that [benefit]").
- **Commits**: Use Conventional Commits (`feat:`, `fix:`, `chore:`).
