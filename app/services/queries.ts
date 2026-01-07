import { gql } from 'urql';

// Queries
export const GET_EXPENSES = gql`
  query GetExpenses($filter: ExpenseFilter, $orderBy: [ExpenseOrderBy!]) {
    expenseCollection(filter: $filter, orderBy: $orderBy) {
      edges {
        node {
          id
          source
          amount
          date
        }
      }
    }
  }
`;

export const GET_INCOMES = gql`
  query GetIncomes($filter: IncomeFilter, $orderBy: [IncomeOrderBy!]) {
    incomeCollection(filter: $filter, orderBy: $orderBy) {
      edges {
        node {
          id
          source
          amount
          date
        }
      }
    }
  }
`;

export const GET_SUMMARY = gql`
  query GetSummary($expenseFilter: ExpenseFilter, $incomeFilter: IncomeFilter) {
    expenseCollection(filter: $expenseFilter) {
      edges {
        node {
          id
          source
          amount
          date
        }
      }
    }
    incomeCollection(filter: $incomeFilter) {
      edges {
        node {
          id
          source
          amount
          date
        }
      }
    }
  }
`;

// Mutations
export const ADD_EXPENSE = gql`
  mutation AddExpense($object: ExpenseInsertInput!) {
    insertIntoExpenseCollection(objects: [$object]) {
      records {
        id
        source
        amount
        date
      }
    }
  }
`;

export const EDIT_EXPENSE = gql`
  mutation EditExpense($id: String!, $set: ExpenseUpdateInput!) {
    updateExpenseCollection(filter: {id: {eq: $id}}, set: $set) {
      records {
        id
        source
        amount
        date
      }
    }
  }
`;

export const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: UUID!) {
    deleteFromExpenseCollection(filter: { id: { eq: $id } }) {
      records {
        id
      }
    }
  }
`;

export const ADD_INCOME = gql`
  mutation AddIncome($object: IncomeInsertInput!) {
    insertIntoIncomeCollection(objects: [$object]) {
      records {
        id
        source
        amount
        date
      }
    }
  }
`;

export const EDIT_INCOME = gql`
  mutation EditIncome($id: String!, $set: IncomeUpdateInput!) {
    updateIncomeCollection(filter: {id: {eq: $id}}, set: $set) {
      records {
        id
        source
        amount
        date
      }
    }
  }
`;

export const DELETE_INCOME = gql`
  mutation DeleteIncome($id: UUID!) {
    deleteFromIncomeCollection(filter: { id: { eq: $id } }) {
      records {
        id
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($object: UserInsertInput!) {
    insertIntoUserCollection(objects: [$object]) {
      records {
        id
      }
    }
  }
`;
