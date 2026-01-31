import React from 'react';
import { useStore } from '../store/useStore';
import type { Item } from '../systems/loot.types';
import { ItemRarity, ItemType } from '../systems/loot.types';
import { calculateStats } from '../systems/statCalculator';

const rarityColors: Record<string, string> = {
  [ItemRarity.COMMON]: '#ffffff',
  [ItemRarity.MAGIC]: '#3366ff',
  [ItemRarity.RARE]: '#ffff00',
  [ItemRarity.UNIQUE]: '#ff8000',
};

export const InventoryUI: React.FC = () => {
  const { inventory, equipped, equipItem, baseStats } = useStore();

  const handleEquip = (item: Item) => {
    let slot = 'ring';
    if (item.type === ItemType.WEAPON) slot = 'weapon';
    if (item.type === ItemType.ARMOR) slot = 'armor';
    equipItem(item, slot);
  };

  const modifiers = Object.values(equipped).flatMap(item => 
    item ? item.stats.map(s => ({
      id: s.id,
      stat: s.stat,
      type: s.type,
      value: s.value,
      source: s.source
    })) : []
  );

  const computedStats = calculateStats(baseStats, modifiers);

  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      width: '320px',
      backgroundColor: 'rgba(20, 20, 20, 0.95)',
      border: '2px solid #554433',
      color: '#ddd',
      padding: '15px',
      fontFamily: 'serif',
      boxShadow: '0 0 20px rgba(0,0,0,0.8)',
      zIndex: 100,
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      <h2 style={{ textAlign: 'center', color: '#daa520', margin: '0 0 15px 0', borderBottom: '1px solid #554433' }}>Character</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1rem', color: '#888', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Stats</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '0.9rem' }}>
          <div>HP: <span style={{ color: '#f55' }}>{Math.round(computedStats.maxHp)}</span></div>
          <div>DMG: <span style={{ color: '#f99' }}>{Math.round(computedStats.physicalDamage)}</span></div>
          <div>APS: <span style={{ color: '#9f9' }}>{computedStats.attackSpeed.toFixed(2)}</span></div>
          <div>MS: <span style={{ color: '#99f' }}>{computedStats.moveSpeed.toFixed(1)}</span></div>
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1rem', color: '#888', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Equipment</h3>
        <div style={{ display: 'grid', gap: '5px' }}>
          {Object.entries(equipped).map(([slot, item]) => (
            <div key={slot} style={{ 
              backgroundColor: 'rgba(0,0,0,0.5)', 
              padding: '8px', 
              border: '1px solid #443322',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: '#887766', marginRight: '10px', textTransform: 'capitalize' }}>{slot}:</span>
              {item ? (
                <div style={{ display: 'inline-block' }}>
                  <div style={{ color: rarityColors[item.rarity] }}>{item.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#777' }}>
                    {item.stats.map((s, i) => (
                      <div key={i}>+{s.value}{s.type === 'percent_increased' ? '%' : ''} {s.stat.replace('_', ' ')}</div>
                    ))}
                  </div>
                </div>
              ) : (
                <span style={{ color: '#444' }}>Empty</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1rem', color: '#888', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Backpack</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '5px'
        }}>
          {inventory.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleEquip(item)}
              title={item.name}
              style={{
                aspectRatio: '1/1',
                backgroundColor: 'rgba(0,0,0,0.5)',
                border: `1px solid ${rarityColors[item.rarity]}88`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                textAlign: 'center',
                padding: '2px',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(50, 50, 50, 0.5)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'}
            >
              {item.name.split(' ').slice(1).join(' ')}
            </div>
          ))}
          {Array.from({ length: Math.max(0, 16 - inventory.length) }).map((_, i) => (
            <div key={`empty-${i}`} style={{
              aspectRatio: '1/1',
              backgroundColor: 'rgba(0,0,0,0.3)',
              border: '1px solid #222',
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};
