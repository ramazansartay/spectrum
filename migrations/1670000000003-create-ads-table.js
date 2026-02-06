exports.up = pgm => {
  pgm.createTable('ads', {
    id: 'id',
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text', notNull: true },
    price: { type: 'decimal(10, 2)', notNull: true },
    category: { type: 'varchar(100)', notNull: true },
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"(id)',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

exports.down = pgm => {
  pgm.dropTable('ads');
};
