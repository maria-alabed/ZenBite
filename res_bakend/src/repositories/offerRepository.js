const db = require("../config/db");

const getOffers = async () => {
  const [rows] = await db.query(
    `
SELECT *
FROM offers
WHERE is_active = 1
`,
  );

  return rows;
};

const createOffer = async ([
  title,
  description,
  image,
  old_price,
  discount_percent,
  new_price,
  start_date,
  end_date,
]) => {
  const [result] = await db.query(
    `
    INSERT INTO offers
    (
      title,
      description,
      image,
      old_price,
      discount_percent,
      new_price,
      is_active,
      start_date,
      end_date
    )
    VALUES(?,?,?,?,?,?,?,?,?)
    `,
    [
      title,
      description,
      image,
      old_price,
      discount_percent,
      new_price,
      1,
      start_date,
      end_date,
    ],
  );

  return result.insertId;
};

const toggleOffer = async (id, is_active) => {
  await db.query(
    `
    UPDATE offers
    SET is_active=?
    WHERE id=?
    `,
    [is_active, id],
  );
};

module.exports = {
  getOffers,
  createOffer,
  toggleOffer,
};
