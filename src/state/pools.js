// Shared pools for scenario randomization (Bug B). Used by randomize.js (fresh-start shuffle)
// and by simulation.js (respawn shuffle) so every new session / truck cycle differs.
import { db } from '../data/db.js'

// ~30 realistic Indian driver names (pan-India mix)
export const DRIVER_POOL = [
  'Ramesh Yadav', 'Anjali Verma', 'Suresh Patel', 'Deepak Shah', 'Imran Khan',
  'Priya Mehta', 'Bhaben Das', 'Rajesh Borah', 'Lakshmi Nair', 'Karthik Raja',
  'Lakshmi Narayanan', 'Prakash Iyer', 'Suresh Kumar', 'Anil Deshmukh', 'Sneha Joshi',
  'Vijay Kulkarni', 'Asha Pawar', 'Arjun Singh', 'Kavita Nair', 'Rohan Desai',
  'Sneha Iyer', 'Vikram Rao', 'Ananya Reddy', 'Bhaben Gogoi', 'Pooja Borah',
  'Dilip Saikia', 'Arun Pandian', 'Murugan R', 'Sachin More', 'Neha Shinde',
  'Amol Kale', 'Sanjay Gupta', 'Meera Krishnan', 'Faisal Ahmed', 'Ritu Sharma',
]

// Per-site regional (customer, destination) pairs — origin→destination logic stays accurate
// to real Indian trade (sarees→Delhi, fabric→Bhiwandi, cotton→Bhiwandi, crackers→Delhi, etc.)
export const ROUTE_POOL = {
  'WH-01': [
    ['Banaras Handloom Exports', 'Delhi ICD, Delhi'],
    ['Bhadohi Carpet Co.', 'Varanasi Depot'],
    ['Kashi Traders', 'Lucknow, UP'],
    ['Pandeypur Mart', 'Prayagraj, UP'],
  ],
  'WH-02': [
    ['Surat Fabric Mills', 'Bhiwandi, Maharashtra'],
    ['Mumbai Diamond Bourse', 'Surat Distribution Hub'],
    ['Morbi Ceramic Cluster', 'Surat Distribution Hub'],
    ['GIDC Export House', 'Mundra Port, Gujarat'],
  ],
  'WH-03': [
    ['Assam Tea Traders', 'Guwahati Cold Chain'],
    ['Idukki Spice Cooperative', 'Guwahati Cold Chain'],
    ['Andhra Rice Mills', 'Guwahati Cold Chain'],
    ['NE Agri Export', 'Kolkata, West Bengal'],
  ],
  'WH-04': [
    ['Delhi Crackers Distributors', 'Delhi, Delhi'],
    ['Chennai Chemical Supply', 'Sivakasi Cross-Dock'],
    ['Coimbatore Paper Mills', 'Sivakasi Cross-Dock'],
    ['Madurai Packaging Co.', 'Sivakasi Cross-Dock'],
  ],
  'WH-05': [
    ['Nagpur Cotton Traders', 'Bhiwandi, Maharashtra'],
    ['Nagpur Auto Components', 'Chakan, Pune'],
    ['Raipur Steel Mills', 'Nagpur Robotics Hub'],
    ['MIHAN Logistics', 'Hyderabad, Telangana'],
  ],
}

/** Pick a random element (uses the passed rng so the sim stays deterministic when desired). */
export function pick(arr, rng = Math.random) {
  return arr[Math.floor(rng() * arr.length)]
}

/** A random (customer, destination) for a shipment at the given site. */
export function randomRoute(siteId, rng = Math.random) {
  const pool = ROUTE_POOL[siteId]
  if (!pool || !pool.length) return null
  return pick(pool, rng)
}

/** All driver names (for the respawn/fresh-start shuffle). */
export const drivers = () => DRIVER_POOL
