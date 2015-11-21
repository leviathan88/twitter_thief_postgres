class CreateInterests < ActiveRecord::Migration
  def change
    create_table :interests do |t|
      t.string :screen_name
      t.string :hashtags
      t.string :user_mentions

      t.timestamps null: false
    end
  end
end
