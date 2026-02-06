exports.up = pgm => {
  pgm.createTable('images', {
    id: 'id',
    ad_id: {
      type: 'integer',
      notNull: true,
      references: '"ads"(id)',
      onDelete: 'CASCADE',
    },
    url: { type: 'varchar(255)', notNull: true },
  });
};

exports.down = pgm => {
  pgm.dropTable('images');
};
