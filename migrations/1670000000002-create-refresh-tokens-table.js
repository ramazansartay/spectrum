exports.up = pgm => {
  pgm.createTable('refresh_tokens', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"(id)',
      onDelete: 'CASCADE',
    },
    token: { type: 'text', notNull: true },
    expires_at: { type: 'timestamp', notNull: true },
  });
};

exports.down = pgm => {
  pgm.dropTable('refresh_tokens');
};
