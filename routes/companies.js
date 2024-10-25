// routes for companies in biztime exercise

const express = require("express");
const slugify = require("slugify");
const ExpressError = require("../expressError");
const router = new express.Router();
const db = require("../db");

// GET /companies: Retrieve a list of companies
router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(
      `SELECT code, name
      FROM companies
      ORDER BY name`
    );
    return res.json({ "companies": result.rows });
  }
  
  catch (err) {
    return next(err);
  }
});

/**  Retrieve a company by its code
 *  => {company: {code, name, descrip, invoices: [id, ...]}}
 */

router.get("/:code", async (req, res, next) => {
  try {
    let code = req.params.code;

    const compResult = await db.query(
      `SELECT code, name, description 
      FROM companies
      WHERE id = $1`,
      [code]
    );

    const invResult = await db.query(
      `SELECT id 
      FROM invoices
      WHERE comp_code = $1`,
      [code]
    );

    if (compResult.rows.length === 0) {
      throw new ExpressError(
        `Can't find company with company code: ${code}`,
        404
      );
    }

    const company = compResult.rows[0];
    const invoices = invResult.rows;

    company.invoices = invoices.map((inv) => inv.id);

    return res.json({ "company": company });
  } catch (err) {
    return next(err);
  }
});

/**  POST/companies: Create a new company
 * {name, descrip} => {company: {code, name, descrip}}
 *
 */

router.post("/", async (re, res, next) => {
  try {
    let { name, description } = req.body;
    let code = slugify(name, { lower: true });

    const result = await db.query(
      `INSERT INTO companies (code, name, description)
            VALUES($1, $2, $3)
            RETURNING code, name, description`,
      [code, name, description]
    );
    return res.status(201).json({"company": result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

/**
 * PUT /[code] => update company
 * {name, descrip} => {company: {code, name, descrip}}
 *
 */

router.put("/:code", async (req, res, next) => {
  try {
    let { name, description } = req.body;
    let code = req.params.code;

    const result = await db.query(
      `UPDATE companies
            SET name=$1, description=$2
            WHERE code = $3
            RETURNING code, name, description`,
      [name, description, code]
    );
    if (results.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404);
    } else {
      return res.json({ company: result.rows[0] });
    }
  } catch (err) {
    return next(err);
  }
});

router.delete("/:code", async (req, res, next) => {
  try {
    let code = req.params.code;

    const result = await db.query(
      `DELETE FROM companies
            WHERE code=$1
            RETURNING code`,
      [code]
    );
    if (result.rows.length == 0) {
      throw new ExpressError(`No such company: ${code}`, 404);
    } else {
      return res.json({ status: "deleted" });
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
