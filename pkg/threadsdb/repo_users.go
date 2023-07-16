package threadsdb

import (
	"browser/pkg/threadsapi"
	"fmt"
)

type UsersRepo interface {
	UpsertUser(user threadsapi.ThreadsApi_User)
	SearchUsers(query string) []threadsapi.ThreadsApi_User
}

// UpsertUser inserts or updates a user
func (client *ThreadsDbClient) UpsertUser(user threadsapi.ThreadsApi_User) bool {
	tx, err := client.Db.Beginx()

	query := `INSERT INTO users 
		(pk, username, profile_pic_url) VALUES (?,?,?)
		ON CONFLICT(pk) 
		DO UPDATE SET username=excluded.username, profile_pic_url=excluded.profile_pic_url;`
	statement, err := tx.Preparex(query)
	defer statement.Close()

	if err != nil {
		fmt.Println("statement prep error", err)
		return false
	} else {
		_, execError := statement.Exec(user.Pk, user.Username, user.ProfilePicUrl)
		if execError != nil {
			return false
		}
		commitErr := tx.Commit()
		if commitErr != nil {
			return false
		}
		return true
	}
}

// SearchUsers returns a list of users partially matching the query
func (client *ThreadsDbClient) SearchUsers(query string) (results []threadsapi.ThreadsApi_User) {
	err := client.Db.Select(&results,
		"SELECT pk, username, profile_pic_url FROM users WHERE username LIKE ?", "%"+query+"%")
	if err != nil {
		fmt.Println("error fetching matching user records", err)
		return nil
	}
	return
}
