/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Receipt, 
  Package, 
  DollarSign, 
  RotateCcw, 
  LayoutDashboard, 
  MapPin, 
  PlusCircle,
  ChevronRight,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SaleItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  timestamp: Date;
  locationId?: string;
}

interface ShippingLocation {
  id: string;
  name: string;
  address: string;
}

type View = 'dashboard' | 'add-sale' | 'locations';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  
  // Sales Items State
  const [items, setItems] = useState<SaleItem[]>(() => {
    const saved = localStorage.getItem('sales_items');
    if (saved) {
      try {
        return JSON.parse(saved).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Shipping Locations State
  const [locations, setLocations] = useState<ShippingLocation[]>(() => {
    const saved = localStorage.getItem('shipping_locations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      { id: '1', name: 'หน้าร้าน', address: 'สาขาหลัก' }
    ];
  });

  // Form States
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [selectedLocation, setSelectedLocation] = useState('');
  
  const [locName, setLocName] = useState('');
  const [locAddress, setLocAddress] = useState('');

  // Persistence
  useEffect(() => {
    localStorage.setItem('sales_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('shipping_locations', JSON.stringify(locations));
  }, [locations]);

  // Actions
  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !quantity) return;

    const newItem: SaleItem = {
      id: crypto.randomUUID(),
      name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      timestamp: new Date(),
      locationId: selectedLocation || undefined
    };

    setItems([newItem, ...items]);
    setName('');
    setPrice('');
    setQuantity('1');
    setSelectedLocation('');
    setCurrentView('dashboard');
  };

  const addLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locName || !locAddress) return;

    const newLoc: ShippingLocation = {
      id: crypto.randomUUID(),
      name: locName,
      address: locAddress
    };

    setLocations([...locations, newLoc]);
    setLocName('');
    setLocAddress('');
  };

  const removeItem = (id: string) => {
    if (confirm('ยืนยันการลบรายการนี้?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const removeLocation = (id: string) => {
    if (confirm('ยืนยันการลบสถานที่นี้? การลบสถานที่อาจส่งผลต่อประวัติการขาย')) {
      setLocations(locations.filter(loc => loc.id !== id));
    }
  };

  const clearAll = () => {
    if (confirm('คุณต้องการล้างข้อมูลการขายทั้งหมดใช่หรือไม่?')) {
      setItems([]);
    }
  };

  const totalAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [items]);

  const getLocationName = (id?: string) => {
    return locations.find(l => l.id === id)?.name || '-';
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Sidebar / Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-50 sm:top-0 sm:bottom-auto sm:border-t-0 sm:border-b">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-around sm:justify-start sm:gap-8 h-16">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-1 rounded-xl transition-all ${currentView === 'dashboard' ? 'text-emerald-600 bg-emerald-50' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider">แดชบอร์ด</span>
          </button>
          <button 
            onClick={() => setCurrentView('add-sale')}
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-1 rounded-xl transition-all ${currentView === 'add-sale' ? 'text-emerald-600 bg-emerald-50' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider">เพิ่มรายการ</span>
          </button>
          <button 
            onClick={() => setCurrentView('locations')}
            className={`flex flex-col sm:flex-row items-center gap-1 sm:gap-2 px-3 py-1 rounded-xl transition-all ${currentView === 'locations' ? 'text-emerald-600 bg-emerald-50' : 'text-neutral-500 hover:text-neutral-900'}`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] sm:text-sm font-semibold uppercase tracking-wider">สถานที่จัดส่ง</span>
          </button>
        </div>
      </nav>

      {/* Content Area */}
      <main className="max-w-5xl mx-auto px-4 pt-8 pb-24 sm:pt-24 min-h-screen">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">ภาพรวมการขาย</h1>
                  <p className="text-neutral-500 text-sm">สรุปข้อมูลและประวัติการขายล่าสุด</p>
                </div>
                {items.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors border border-red-100"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    ล้างข้อมูล
                  </button>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-blue-50 p-2 rounded-lg">
                      <Package className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-neutral-500">รายการทั้งหมด</span>
                  </div>
                  <div className="text-3xl font-bold">{items.length} <span className="text-sm font-normal text-neutral-400">รายการ</span></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-emerald-50 p-2 rounded-lg">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <span className="text-sm font-medium text-neutral-500">ยอดรวมสุทธิ</span>
                  </div>
                  <div className="text-3xl font-bold text-emerald-600">
                    {totalAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })} <span className="text-sm font-normal text-neutral-400">บาท</span>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hidden lg:block">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-amber-50 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-amber-600" />
                    </div>
                    <span className="text-sm font-medium text-neutral-500">สถานที่จัดส่ง</span>
                  </div>
                  <div className="text-3xl font-bold">{locations.length} <span className="text-sm font-normal text-neutral-400">แห่ง</span></div>
                </div>
              </div>

              {/* Recent History Table */}
              <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <h2 className="font-semibold flex items-center gap-2">
                    <History className="w-5 h-5 text-neutral-400" />
                    ประวัติการขายล่าสุด
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-neutral-50/50">
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">วัน/เวลา</th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">สินค้า</th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">สถานที่</th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 text-right">รวม</th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 text-center">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {items.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-neutral-400 italic">
                            ยังไม่มีรายการขายในขณะนี้
                          </td>
                        </tr>
                      ) : (
                        items.map((item) => (
                          <tr key={item.id} className="hover:bg-neutral-50/50 transition-colors group">
                            <td className="px-6 py-4 text-sm text-neutral-400 whitespace-nowrap">
                              <div className="font-medium text-neutral-600">
                                {item.timestamp.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                              </div>
                              <div className="text-[10px] opacity-70">
                                {item.timestamp.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium">{item.name}</div>
                              <div className="text-xs text-neutral-400">{item.quantity} x {item.price.toLocaleString()}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-500">
                              {getLocationName(item.locationId)}
                            </td>
                            <td className="px-6 py-4 text-right font-semibold text-emerald-600">
                              {(item.price * item.quantity).toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => removeItem(item.id)}
                                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'add-sale' && (
            <motion.div
              key="add-sale"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">บันทึกรายการขายใหม่</h1>
                <p className="text-neutral-500 text-sm">กรอกรายละเอียดสินค้าและสถานที่จัดส่ง</p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-neutral-200 shadow-sm">
                <form onSubmit={addItem} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">ชื่อสินค้า</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="ระบุชื่อสินค้า..."
                        className="w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-lg"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">ราคา (บาท)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="0.00"
                          className="w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">จำนวน</label>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          min="1"
                          className="w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-lg"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400 mb-2">สถานที่จัดส่ง</label>
                      <select
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-lg appearance-none"
                      >
                        <option value="">-- เลือกสถานที่ --</option>
                        {locations.map(loc => (
                          <option key={loc.id} value={loc.id}>{loc.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 active:scale-[0.98]"
                    >
                      <Plus className="w-6 h-6" />
                      บันทึกรายการขาย
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {currentView === 'locations' && (
            <motion.div
              key="locations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">จัดการสถานที่จัดส่ง</h1>
                  <p className="text-neutral-500 text-sm">เพิ่มหรือลบสถานที่จัดส่งสินค้า</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Add Location Form */}
                <div className="lg:col-span-1">
                  <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm sticky top-24">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-emerald-600" />
                      เพิ่มสถานที่ใหม่
                    </h2>
                    <form onSubmit={addLocation} className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">ชื่อสถานที่</label>
                        <input
                          type="text"
                          value={locName}
                          onChange={(e) => setLocName(e.target.value)}
                          placeholder="เช่น คลังสินค้า A"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">ที่อยู่ / รายละเอียด</label>
                        <textarea
                          value={locAddress}
                          onChange={(e) => setLocAddress(e.target.value)}
                          placeholder="ระบุที่อยู่..."
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all min-h-[100px]"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        เพิ่มสถานที่
                      </button>
                    </form>
                  </div>
                </div>

                {/* Locations List */}
                <div className="lg:col-span-2 space-y-4">
                  <AnimatePresence initial={false}>
                    {locations.map((loc) => (
                      <motion.div
                        key={loc.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm flex items-start justify-between group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="bg-neutral-100 p-3 rounded-xl text-neutral-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            <MapPin className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{loc.name}</h3>
                            <p className="text-neutral-500 text-sm mt-1">{loc.address}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeLocation(loc.id)}
                          className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {locations.length === 0 && (
                    <div className="text-center py-12 bg-neutral-100/50 rounded-3xl border border-dashed border-neutral-300 text-neutral-400">
                      ยังไม่มีสถานที่จัดส่ง
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
