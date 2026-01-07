import { graphqlClient } from './graphqlClient';
import { ADD_EXPENSE, ADD_INCOME, DELETE_EXPENSE, EDIT_EXPENSE, GET_EXPENSES, GET_SUMMARY } from './queries';
import { supabase } from './supabase';

export const dataService = {
  // Authentication check helper
  async getUserId() {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
  },

  async getExpenses(dateFilter?: string) {
    const userId = await this.getUserId();
    if (!userId) return [];

    const { data, error } = await graphqlClient.query(GET_EXPENSES, {
      filter: {
        userId: { eq: userId },
        ...(dateFilter ? { date: { eq: dateFilter } } : {})
      }
    }).toPromise();

    if (error) throw error;
    return data.expenseCollection.edges.map((e: any) => e.node);
  },

  async addExpense(expense: { source: string; amount: number }) {
    const userId = await this.getUserId();
    if (!userId) throw new Error('Not authenticated');

    const { data, error } = await graphqlClient.mutation(ADD_EXPENSE, {
      object: { ...expense, userId }
    }).toPromise();

    if (error) throw error;
    return data;
  },

  async updateExpense(id: string, expense: any) {
    const { data, error } = await graphqlClient.mutation(EDIT_EXPENSE, {
      id,
      set: expense
    }).toPromise();

    if (error) throw error;
    return data;
  },

  async deleteExpense(id: string) {
    const { data, error } = await graphqlClient.mutation(DELETE_EXPENSE, {
      id
    }).toPromise();

    if (error) throw error;
    return data;
  },

  async addIncome(income: { source: string; amount: number }) {
    const userId = await this.getUserId();
    if (!userId) throw new Error('Not authenticated');

    const { data, error } = await graphqlClient.mutation(ADD_INCOME, {
      object: { ...income, userId }
    }).toPromise();

    if (error) throw error;
    return data;
  },

  async getSummaryStats() {
    // This is a simplified version, ideally handled by a custom GraphQL function or aggregated query
    const { data, error } = await graphqlClient.query(GET_SUMMARY, {}).toPromise();
    if (error) throw error;

    // Process data to calculate today, monthly, and available funds (Income - Expense)
    // Note: Real implementation would need more complex aggregation
    return {
      todayExpense: 0, 
      availableMoney: 0,
      thisMonthExpense: 0,
      graphData: []
    };
  }
};
