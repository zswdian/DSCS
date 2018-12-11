using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using HotelSystem.Models;

namespace HotelSystem.Controllers
{
    public class LiveinsController : Controller
    {
        private readonly hotelContext _context;

        public LiveinsController(hotelContext context)
        {
            _context = context;
        }

        // GET: Liveins
        public async Task<IActionResult> Index()
        {
            var hotelContext = _context.Livein.Include(l => l.Operator).Include(l => l.Room);
            return View(await hotelContext.ToListAsync());
        }

        // GET: Liveins/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var livein = await _context.Livein
                .Include(l => l.Operator)
                .Include(l => l.Room)
                .FirstOrDefaultAsync(m => m.InNo == id);
            if (livein == null)
            {
                return NotFound();
            }

            return View(livein);
        }

        // GET: Liveins/Create
        public IActionResult Create()
        {
            ViewData["OperatorId"] = new SelectList(_context.Operator, "OperatorId", "OperatorName");
            ViewData["RoomId"] = new SelectList(_context.Roominfo, "RoomId", "State");
            return View();
        }

        // POST: Liveins/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("InNo,RoomId,CustomerId,PersonNum,InTime,Money,Days,OperatorId")] Livein livein)
        {
            if (ModelState.IsValid)
            {
                _context.Add(livein);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["OperatorId"] = new SelectList(_context.Operator, "OperatorId", "OperatorName", livein.OperatorId);
            ViewData["RoomId"] = new SelectList(_context.Roominfo, "RoomId", "State", livein.RoomId);
            return View(livein);
        }

        // GET: Liveins/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var livein = await _context.Livein.FindAsync(id);
            if (livein == null)
            {
                return NotFound();
            }
            ViewData["OperatorId"] = new SelectList(_context.Operator, "OperatorId", "OperatorName", livein.OperatorId);
            ViewData["RoomId"] = new SelectList(_context.Roominfo, "RoomId", "State", livein.RoomId);
            return View(livein);
        }

        // POST: Liveins/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("InNo,RoomId,CustomerId,PersonNum,InTime,Money,Days,OperatorId")] Livein livein)
        {
            if (id != livein.InNo)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(livein);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!LiveinExists(livein.InNo))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            ViewData["OperatorId"] = new SelectList(_context.Operator, "OperatorId", "OperatorName", livein.OperatorId);
            ViewData["RoomId"] = new SelectList(_context.Roominfo, "RoomId", "State", livein.RoomId);
            return View(livein);
        }

        // GET: Liveins/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var livein = await _context.Livein
                .Include(l => l.Operator)
                .Include(l => l.Room)
                .FirstOrDefaultAsync(m => m.InNo == id);
            if (livein == null)
            {
                return NotFound();
            }

            return View(livein);
        }

        // POST: Liveins/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var livein = await _context.Livein.FindAsync(id);
            _context.Livein.Remove(livein);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool LiveinExists(int id)
        {
            return _context.Livein.Any(e => e.InNo == id);
        }
    }
}
