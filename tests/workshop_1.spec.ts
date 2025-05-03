import { test, expect } from '@playwright/test';

test.describe('Deck of Cards API Tests', () => {
  const BASE_URL = 'https://deckofcardsapi.com';

  test('should successfully shuffle a new deck', async ({ request }) => {
    // Test with default deck count (1)
    const defaultDeckResponse = await request.get(`${BASE_URL}/api/deck/new/shuffle/`);
    expect(defaultDeckResponse.ok()).toBeTruthy();
    
    const defaultDeckData = await defaultDeckResponse.json();
    expect(defaultDeckData.success).toBe(true);
    expect(defaultDeckData.deck_id).toBeTruthy();
    expect(defaultDeckData.shuffled).toBe(true);
    expect(defaultDeckData.remaining).toBe(52);
    
    // Test with specific deck count (6 for Blackjack)
    const blackjackDeckResponse = await request.get(`${BASE_URL}/api/deck/new/shuffle/?deck_count=6`);
    expect(blackjackDeckResponse.ok()).toBeTruthy();
    
    const blackjackDeckData = await blackjackDeckResponse.json();
    expect(blackjackDeckData.success).toBe(true);
    expect(blackjackDeckData.deck_id).toBeTruthy();
    expect(blackjackDeckData.shuffled).toBe(true);
    expect(blackjackDeckData.remaining).toBe(52 * 6); // 312 cards in 6 decks
  });

  test('should support both GET and POST methods for shuffling', async ({ request }) => {
    // Test with POST method
    const postResponse = await request.post(`${BASE_URL}/api/deck/new/shuffle/`, {
      form: {
        deck_count: '3'
      }
    });
    
    expect(postResponse.ok()).toBeTruthy();
    
    const postData = await postResponse.json();
    expect(postData.success).toBe(true);
    expect(postData.remaining).toBe(52 * 3); // 156 cards in 3 decks
  });

  test('should persist deck state with valid deck_id', async ({ request }) => {
    // First create a deck
    const newDeckResponse = await request.get(`${BASE_URL}/api/deck/new/shuffle/`);
    const newDeckData = await newDeckResponse.json();
    const deckId = newDeckData.deck_id;
    
    // Then verify we can access it with the returned ID
    const retrieveDeckResponse = await request.get(`${BASE_URL}/api/deck/${deckId}/shuffle/`);
    expect(retrieveDeckResponse.ok()).toBeTruthy();
    
    const retrievedDeckData = await retrieveDeckResponse.json();
    expect(retrievedDeckData.deck_id).toBe(deckId);
    expect(retrievedDeckData.success).toBe(true);
    expect(retrievedDeckData.shuffled).toBe(true);
  });
});