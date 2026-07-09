import { query } from './connection';
import logger from '../logger/logger';

export async function initializeSchema(): Promise<void> {
  try {
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255),
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create categories table
    await query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create feedback table
    await query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        category_id INTEGER REFERENCES categories(id) ON DELETE RESTRICT,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        email VARCHAR(255) NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for better query performance
    await query(`
      CREATE INDEX IF NOT EXISTS idx_feedback_category_id ON feedback(category_id);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
    `);

    await query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);

    // Insert default categories
    const categoriesResult = await query('SELECT COUNT(*) FROM categories');
    if (categoriesResult.rows[0].count === '0') {
      const categories = [
        { name: 'Bug Report', description: 'Report a bug or issue' },
        { name: 'Feature Request', description: 'Request a new feature' },
        { name: 'Improvement', description: 'Suggest an improvement' },
        { name: 'Documentation', description: 'Documentation feedback' },
        { name: 'Other', description: 'Other feedback' },
      ];

      for (const category of categories) {
        await query(
          'INSERT INTO categories (name, description) VALUES ($1, $2)',
          [category.name, category.description]
        );
      }

      logger.info('Default categories inserted');
    }

    logger.info('Database schema initialized successfully');
  } catch (error) {
    logger.error('Failed to initialize database schema', { error });
    throw error;
  }
}
