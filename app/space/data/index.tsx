import { useEffect, useMemo, useState } from "react"
import { DataSubSection } from "@/app/editor/data/components/sub-section"
import { useResumes, useResumesDB } from "@/services/space"
import { curSection } from "@/store"
import { appStore, takeResume } from "@/store/model"
import { get } from "lodash-es"
import MaterialReactTable, {
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table"
import { MRT_Localization_ZH_HANS } from "material-react-table/locales/zh-Hans"
import { mutate } from "swr"

import {
  DBItem,
  copyAssignToResume,
  deleteResumeItems,
  findItemAndOwner,
  getResumeMeta,
  reassignToResume,
  syncChangeToResumes,
} from "@/lib/resume/database"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { H3, H4, List } from "@/components/ui/typography"

const DataManager = () => {
  return (
    <div className="m-1">
      <Header />
      <main className="container">
        <DataTable />
      </main>
    </div>
  )
}

const Header = () => {
  return (
    <header className="m-1">
      <div className="flex justify-between items-center">
        <div className="flex flex-row justify-between space-x-1 items-center">
          {/*<SearchableSelect>*/}
          {/*  <Label>语言：</Label>*/}
          {/*  <Badge variant="secondary">未选择</Badge>*/}
          {/*</SearchableSelect>*/}
        </div>
        <nav className="hidden md:flex space-x-8">
          <H4>个人履历库</H4>
        </nav>
        <div className="flex items-center"></div>
      </div>
    </header>
  )
}

const columns: MRT_ColumnDef<DBItem>[] = [
  {
    accessorKey: "name",
    header: "单项名",
  },
  {
    accessorKey: "type",
    header: "分类",
  },
  {
    accessorKey: "desc",
    header: "描述",
  },
  {
    accessorKey: "assign",
    header: "所属简历",
    Cell: ({ cell }) => (
      <div className="flex flex-row">
        {cell.row.original.assign?.map((id) => (
          <Badge variant="outline" key={id}>
            {getResumeMeta(id)?.title}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "updateAt",
    header: "上次更新",
  },
]

const DataTable = () => {
  const { data, isLoading } = useResumesDB()
  const [rowSelection, setRowSelection] = useState({})
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [editedData, setEditedData] = useState(null)

  const [selectedResumes, setSelectedResumes] = useState<string[]>([])

  const assignResumes = async (event: any, isCopy?: boolean) => {
    const ids = Object.keys(rowSelection)
    let dbItems = data!
      .filter((_, index) => ids.includes(`${index}`))
      .map((item) => item.id!)

    console.log("delay assign", dbItems, selectedResumes)
    if (!isCopy) reassignToResume(dbItems, selectedResumes)
    else copyAssignToResume(dbItems, selectedResumes)

    await mutate("resumes-db")
    setRowSelection({})
    setIsAssignDialogOpen(false)
  }

  const deleteItems = async () => {
    const ids = Object.keys(rowSelection)
    let dbItems = data!
      .filter((_, index) => ids.includes(`${index}`))
      .map((item) => item.id!)
    console.log("delay del", dbItems)
    deleteResumeItems(dbItems)

    await mutate("resumes-db")

    setRowSelection({})
  }

  const editItem = (row: MRT_Row<DBItem>) => {
    const related = findItemAndOwner(row.original.id)
    takeResume(related.owners[0].id)
    curSection.curr = related.path!
    setEditedData(related)
    console.log("onEditing:", related)
    setIsEditDialogOpen(true)
  }

  const onSyncEdit = async () => {
    const change = get(appStore.appModelWithReactive.data, curSection.curr)

    syncChangeToResumes(
      { path: curSection.curr, change },
      editedData!.owners.map((o) => o.id)
    )

    setIsEditDialogOpen(false)
    curSection.curr = "basics"
    setEditedData(null)
    await mutate("resumes-db")
  }

  const refresh = async () => {
    await mutate("resumes-db")
  }

  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={data!}
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
        // initialState={{
        //   columnPinning: {
        //     right: ["actions"],
        //   },
        // }}
        renderTopToolbarCustomActions={({ table }) => (
          <div className="space-x-1">
            <Button variant={"secondary"} size={"sm"} onClick={refresh}>
              <Icons.refresh />
            </Button>
            {/*<Button size={"sm"}><Icons.plus/></Button>*/}

            <Button
              size={"sm"}
              onClick={deleteItems}
              disabled={!table.getIsSomeRowsSelected()}
              variant={"destructive"}
            >
              <Icons.del />
            </Button>

            <Dialog
              open={isAssignDialogOpen}
              onOpenChange={setIsAssignDialogOpen}
            >
              <DialogTrigger>
                <Button
                  size={"sm"}
                  disabled={!table.getIsSomeRowsSelected()}
                  variant={"outline"}
                >
                  <Icons.resume />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>简历归属</DialogTitle>
                  <DialogDescription>决定数据项所属的简历</DialogDescription>
                </DialogHeader>
                <ResumesList onSelectedChange={setSelectedResumes} />
                <DialogFooter>
                  <Button
                    onClick={(e) => assignResumes(e, true)}
                    variant={"ghost"}
                  >
                    唯一归属
                  </Button>
                  <Button onClick={assignResumes}>同源归属</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
        enableRowActions
        renderRowActions={({ row }) => (
          <div>
            <div className="space-y-1">
              <Button
                className="inline-block"
                variant={"secondary"}
                size={"sm"}
                onClick={() => editItem(row)}
              >
                <Icons.edit />
              </Button>
              {/*<Button className="inline-block" size={"sm"} variant={"secondary"}><Icons.del/></Button>*/}
            </div>
          </div>
        )}
        state={{
          rowSelection,
          isLoading,
        }}
        localization={MRT_Localization_ZH_HANS}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>数据编辑</DialogTitle>
            <DialogDescription>
              对数据进行实时编辑，点击保存后，数据将会同步到所有使用该数据的简历中。
            </DialogDescription>
          </DialogHeader>
          <div className="flex max-h-[46rem]">
            <DataSubSection />
          </div>
          <DialogFooter>
            <Button onClick={onSyncEdit}>确认同步</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

const ResumesList = ({ onSelectedChange }) => {
  const { data } = useResumes()

  const [selectedResumes, setSelectedResumes] = useState<string[]>([])

  const handleCheckboxChange = (checked: boolean, id: string) => {
    if (checked) {
      const newSelected = [...selectedResumes, id]
      setSelectedResumes(newSelected)
      onSelectedChange(newSelected)
    } else {
      const newSelected = selectedResumes.filter((resumeId) => resumeId !== id)
      setSelectedResumes(newSelected)
      onSelectedChange(newSelected)
    }
  }

  return (
    <List className="m-1">
      {data.map((resume) => (
        <li key={resume.id} className="items-top flex space-x-2">
          <Checkbox
            id={resume.id}
            checked={selectedResumes.includes(resume.id)}
            onCheckedChange={(checked) =>
              handleCheckboxChange(checked, resume.id)
            }
          />
          <div className="grid gap-1.5 leading-none">
            <label
              htmlFor={resume.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {resume.title}
            </label>
            <p className="text-sm text-muted-foreground">
              {resume.description}
            </p>
          </div>
        </li>
      ))}
    </List>
  )
}

export default DataManager
