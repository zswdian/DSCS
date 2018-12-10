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
    public class RoomtypesController : Controller
    {
        private readonly hotelContext _context;

        public RoomtypesController(hotelContext context)
        {
            _context = context;
        }

        // GET: Roomtypes
        public async Task<IActionResult> Index()
        {
            return View(await _context.Roomtype.ToListAsync());
        }

        // GET: Roomtypes/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var roomtype = await _context.Roomtype
                .FirstOrDefaultAsync(m => m.TypeId == id);
            if (roomtype == null)
            {
                return NotFound();
            }

            return View(roomtype);
        }

        // GET: Roomtypes/Create
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("TypeId,Type,BedNum,Price,Foregift,ClRoom,ClPrice")] Roomtype roomtype)
        {
            if (ModelState.IsValid)
            {
                _context.Add(roomtype);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(roomtype);
        }

        // GET: Roomtypes/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var roomtype = await _context.Roomtype.FindAsync(id);
            if (roomtype == null)
            {
                return NotFound();
            }
            return View(roomtype);
        }

      
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("TypeId,Type,BedNum,Price,Foregift,ClRoom,ClPrice")] Roomtype roomtype)
        {
            if (id != roomtype.TypeId)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(roomtype);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RoomtypeExists(roomtype.TypeId))
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
            return View(roomtype);
        }

        // GET: Roomtypes/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var roomtype = await _context.Roomtype
                .FirstOrDefaultAsync(m => m.TypeId == id);
            if (roomtype == null)
            {
                return NotFound();
            }

            return View(roomtype);
        }

        // POST: Roomtypes/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var roomtype = await _context.Roomtype.FindAsync(id);
            _context.Roomtype.Remove(roomtype);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool RoomtypeExists(int id)
        {
            return _context.Roomtype.Any(e => e.TypeId == id);
        }
    }
}
