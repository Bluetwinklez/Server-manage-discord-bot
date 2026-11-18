const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

process.env.BOT_DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'botdata-test-'));
const { PermissionFlagsBits } = require('discord.js');
const { setSettings } = require('../src/utils/database');
const { executeAction } = require('../src/utils/aiActionExecutor');

const GUILD = 'g-destructive';
const AI_ROLE = 'ai-role';
setSettings(GUILD, { aiManagerRoleId: AI_ROLE });

function context(memberId, ownPermissions) {
    const deleted = [];
    const channel = (id) => ({ id, name: id, delete: async () => deleted.push(id) });
    const channels = new Map([['a', channel('a')], ['b', channel('b')]]);
    const guild = { id: GUILD, channels: { cache: channels } };
    const member = {
        id: memberId,
        roles: { cache: { has: (id) => id === AI_ROLE } },
        permissions: { has: (perm) => ownPermissions.includes(perm) }
    };
    return { deleted, ctx: { guild, member, channel: channels.get('a'), client: {} } };
}

test('AI Yönetici rolü tek başına geri alınamaz toplu silmeyi yaptıramaz', async () => {
    const { deleted, ctx } = context('rol-sahibi', []);
    for (const action of ['delete_all_channels', 'bulk_delete_channels', 'delete_all_roles', 'bulk_delete_roles']) {
        const first = await executeAction(action, {}, ctx);
        const second = await executeAction(action, {}, ctx);
        assert.match(first, /AI Yönetici rolü yeterli değil/, action);
        assert.match(second, /AI Yönetici rolü yeterli değil/, action);
    }
    assert.deepEqual(deleted, []);
});

test('gerçek yetkisi olan üyeye önce onay sorulur', async () => {
    const { deleted, ctx } = context('yonetici', [PermissionFlagsBits.Administrator]);
    const first = await executeAction('delete_all_channels', {}, ctx);
    assert.match(first, /GERİ ALINAMAZ/);
    assert.deepEqual(deleted, []);
});
