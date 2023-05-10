import {useEffect, useMemo, useState} from "react"
import {faker} from "@faker-js/faker"
import {compareItems, rankItem} from "@tanstack/match-sorter-utils"
import {FilterFn, SortingFn, sortingFns} from "@tanstack/react-table"
import MaterialReactTable, {
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table"
import {MRT_Localization_ZH_HANS} from "material-react-table/locales/zh-Hans"

import {Icons} from "@/components/icons"
import {SearchableSelect} from "@/components/searchable-select"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {H4} from "@/components/ui/typography"
import {useResumesDB} from "@/app/api/space";
import {ResumeItem} from "@/types";
import {DBItem} from "@/lib/resume/database";

export const DataManager = () => {
  return (
    <div className="m-1">
      <Header/>
      <main className="container">
        <DataTable/>
      </main>
    </div>
  )
}

const Header = () => {
  return (
    <header className="m-1">
      <div className="flex justify-between items-center">
        <div className="flex flex-row justify-between space-x-1 items-center">
          <SearchableSelect>
            <Label>语言：</Label>
            <Badge variant="secondary">未选择</Badge>
          </SearchableSelect>
        </div>
        <nav className="hidden md:flex space-x-8">
          <H4>个人履历库</H4>
        </nav>
        <div className="flex items-center">
          <Button className="h-8 p-1 mx-1" variant="ghost">
            <Icons.export size={16} className="mr-1"/>
            导出
          </Button>
          <Button className="h-8 p-1 mx-1" variant="ghost">
            <Icons.history size={16} className="mr-1"/>
            更新时间 2023.05.07 21:29:13
          </Button>
        </div>
      </div>
    </header>
  )
}

const columns: MRT_ColumnDef<DBItem>[] = [
  {
    accessorKey: "name",
    header: "项名",
  },
  {
    accessorKey: "type",
    header: "分类",
  },
  {
    accessorKey: "desc",
    header: "细节",
  },
  {
    accessorKey: "assign",
    header: "所属简历",
  },
  {
    accessorKey: "updateAt",
    header: "上次更新",
  },
  {
    accessorKey: "actions",
    header: "操作",
    enableColumnFilter: false,
    enableGrouping: false,
    enableGlobalFilter: false,
    enableResizing: false,
    enableSorting: false,
    enableClickToCopy: false,
    enableColumnDragging: false,
  },

]

const DataTable = () => {
  const {data, isLoading} = useResumesDB()
  const [rowSelection, setRowSelection] = useState({});


  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enablePinning
      enableRowSelection
      enableClickToCopy
      enableColumnActions
      enableMultiRemove
      enableGrouping
      enableBottomToolbar
      enableColumnDragging
      positionActionsColumn="last"
      enableStickyHeader
      enableStickyFooter
      enableRowNumbers
      enableColumnResizing
      enableColumnOrdering
      enableColumnFilterModes
      onRowSelectionChange={setRowSelection}
      positionToolbarAlertBanner="bottom"
      initialState={{
        columnPinning: {
          right: ["actions"],
        },
      }}
      renderTopToolbarCustomActions={({table}) => (
        <div className="space-x-1">
          <Button variant={"secondary"} size={"sm"}><Icons.refresh/></Button>
          <Button size={"sm"}><Icons.plus/></Button>

          <Button size={"sm"} disabled={!table.getIsSomeRowsSelected()} variant={"destructive"}><Icons.del/></Button>
          <Button size={"sm"} disabled={!table.getIsSomeRowsSelected()} variant={"outline"}><Icons.resume/></Button>
        </div>
      )}
      state={{
        rowSelection,
        isLoading
      }}
      localization={MRT_Localization_ZH_HANS}
    />
  )
}
