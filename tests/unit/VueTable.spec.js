import { expect } from 'chai'
import { createLocalVue, shallowMount } from '@vue/test-utils'
import VueTable from '@/components/VueTable.vue'

const data = [
  { "name": "smss.exe", "device": "Stark", "path": "\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe", "status": "scheduled" },
  { "name": "netsh.exe", "device": "Targaryen", "path": "\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe", "status": "available" },
  { "name": "uxtheme.dll", "device": "Lannister", "path": "\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll", "status": "available" },
  { "name": "cryptbase.dll", "device": "Martell", "path": "\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll", "status": "scheduled" },
  { "name": "s7za.exe", "device": "Baratheon", "path": "\\Device\\HarddiskVolume1\\temp\\7za.exe", "status": "scheduled" }
]

let component;
let localVue;

describe('test', () => {

  beforeEach(() => {
    localVue = createLocalVue();
    localVue.directive('indeterminate', {
      inserted: function (el) {
        el.indeterminate = false;
      }
    })
    component = shallowMount(VueTable, {
      localVue,
      propsData: {
        data
      }
    });
  });

  it("should render VueTable component on mount", () => {
    expect(component.find(VueTable).exists()).to.be.true;
  });

  it('Verifies that Download Selected button is disabled when no record is selected', async () => {
    const buttonWrapper = component.find("#downloadSelectedBtn");
    const isDisabled = buttonWrapper.classes();
    expect(isDisabled).to.include.members(["btn", "btn-disabled"])
  })

  it('Verifies that Download Selected button is enabled when no record is selected', async () => {
      await component.setData({
        selected: ["cryptbase.dll_\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll"]
      });
      const buttonWrapper = component.find("#downloadSelectedBtn");
      const isDisabled = buttonWrapper.classes();
      expect(isDisabled).to.not.include.members(["btn-disabled"]);
  })

  it('Verifies that select all checkbox is in indeterminate state when some records are selected', async () => {
    await component.setData({
      selected: ["cryptbase.dll_\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll"]
    });
    expect(component.vm.indeterminateChkboxModel).to.be.equal(true);
  })

  it('Verifies that select all checkbox is NOT in indeterminate state when NO records are selected', async () => {
    expect(component.vm.indeterminateChkboxModel).to.be.equal(false);
  })

  it('Verifies that select all checkbox is NOT in indeterminate state when ALL records are selected', async () => {
    await component.setData({
      selected: [
        "smss.exe_\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe",
        "netsh.exe_\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe",
        "uxtheme.dll_\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll",
        "cryptbase.dll_\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll",
        "s7za.exe_\\Device\\HarddiskVolume1\\temp\\7za.e1xe"
      ]
    });
    expect(component.vm.indeterminateChkboxModel).to.be.equal(false);
  })
  
  it('Verifies if table has no data to show', async () => {
    component = shallowMount(VueTable, {
      localVue,
      propsData: {
        data:null
      }
    });
    expect(component.text()).to.contain("No data to show right now!!");
  })

  it('Verifies if table shows correct number of rows', async () => {
    const tableRows = component.findAll('tbody tr');
    expect(tableRows.length).to.be.equal(data.length);
  })

  it('Verifies if clicking on a row selects it', async () => {
    const tableRows = component.findAll('tbody tr:first-child');
    await tableRows.trigger('click');
    expect(component.vm.selected.length).to.be.equal(1);
  })

  it('Verifies if clicking on a selected row deselects it', async () => {
    await component.setData({
      selected: ["cryptbase.dll_\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll"]
    });
    const tableRows = component.findAll('tbody tr:first-child');
    await tableRows.trigger('click');
    expect(component.vm.selected.length).to.be.equal(0);
  })

  it('Verifies that after sorting, list rendering order should change', async () => {
    const nameHeading = component.findAll('table thead tr:nth-child(2) th:nth-child(2)');
    await nameHeading.trigger('click');
    expect(JSON.stringify(data)).to.not.be.equal(JSON.stringify(component.vm.sortedData));
  })

});