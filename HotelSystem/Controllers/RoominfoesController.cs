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
    public class RoominfoesController : Controller
    {
        private readonly hotelContext _context;

        public RoominfoesController(hotelContext context)
        {
            _context = context;
        }

        // GET: Roominfoes
        public async Task<IActionResult> Index()
        {
            var hotelContext = _context.Roominfo.Include(r => r.Type);
            return View(await hotelContext.ToListAsync());
        }

        // GET: Roominfoes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var roominfo = await _context.Roominfo
                .Include(r => r.Type)
                .FirstOrDefaultAsync(m => m.RoomId == id);
            if (roominfo == null)
            {
                return NotFound();
            }

            return View(roominfo);
        }

        // GET: Roominfoes/Create
        public IActionResult Create()
        {
            ViewData["TypeId"] = new SelectList(_context.Roomtype, "TypeId", "Type");
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("RoomId,TypeId,State,Statetime,Remark")] Roominfo roominfo)
        {
            if (ModelState.IsValid)
            {
                _context.Add(roominfo);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            ViewData["TypeId"] = new SelectList(_context.Roomtype, "TypeId", "Type", roominfo.TypeId);
            return View(roominfo);
        }

        // GET: Roominfoes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var roominfo = await _context.Roominfo.FindAsync(id);
            if (roominfo == null)
            {
                return NotFound();
            }
            ViewData["TypeId"] = new SelectList(_context.Roomtype, "TypeId", "Type", roominfo.TypeId);
            return View(roominfo);
        }

      
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("RoomId,TypeId,State,Statetime,Remark")] Roominfo roominfo)
        {
            if (id != roominfo.RoomId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(roominfo);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RoominfoExists(roominfo.RoomId))
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
            ViewData["TypeId"] = new SelectList(_context.Roomtype, "TypeId", "Type", roominfo.TypeId);
            return View(roominfo);
        }

        // GET: Roominfoes/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var roominfo = await _context.Roominfo
                .Include(r => r.Type)
                .FirstOrDefaultAsync(m => m.RoomId == id);
            if (roominfo == null)
            {
                return NotFound();
            }

            return View(roominfo);
        }

        // POST: Roominfoes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var roominfo = await _context.Roominfo.FindAsync(id);
            _context.Roominfo.Remove(roominfo);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool RoominfoExists(int id)
        {
            return _context.Roominfo.Any(e => e.RoomId == id);
        }
    }
}
