import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "layouts"})
export class LayoutEntity {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @Column({ type: "text" })
  layout: string | undefined;

  @Column({ type: "varchar", length: 255 })
  name: string | undefined;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date | undefined;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
    onUpdate: "CURRENT_TIMESTAMP",
  })
  updated_at: Date | undefined;
}